[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$sharedRoot = Join-Path $projectRoot 'skills'

# Keep upstream skills in place, including their references, scripts and assets.
$sources = [ordered]@{
    'marp-creator'      = 'classmethod-marp-theme\.claude\skills\marp-creator'
    'slide-story'       = 'minorun-marp-skill\skills\slide-story'
    'slide-design-dark' = 'minorun-marp-skill\skills\slide-design-dark'
    'slide-figures'     = 'minorun-marp-skill\skills\slide-figures'
    'yomiyasu'          = 'yomiyasu\skills\yomiyasu'
    'creating-marp-slides' = 'marp-slides\.claude\skills\creating-marp-slides'
    'marp-slide'        = 'agent-toolkit\skills\marp-slide'
    'interactive-slide' = 'interactive-slide\plugins\interactive-slide\skills\interactive-slide'
    'kb-agent-webapp-cdk' = 'agent-builder-skills\skills\kb-agent-webapp-cdk'
    'kb-agentcore-cdk' = 'agent-builder-skills\skills\kb-agentcore-cdk'
    'kb-strands-agentcore' = 'agent-builder-skills\skills\kb-strands-agentcore'
    'kb-agentcore-observability' = 'agent-builder-skills\skills\kb-agentcore-observability'
    'kb-agentcore-identity' = 'agent-builder-skills\skills\kb-agentcore-identity'
    'kb-demo-app-auth' = 'agent-builder-skills\skills\kb-demo-app-auth'
    'kb-frontend-sse' = 'agent-builder-skills\skills\kb-frontend-sse'
    'cdkd-deploy' = 'agent-builder-skills\skills\cdkd-deploy'
    'literature-review-ml' = 'literature-review'
    'youtube-full' = 'youtube-skills\skills\youtube-full'
    'file-organizer' = 'awesome-codex-skills\file-organizer'
    'obsidian-markdown' = 'obsidian-skills\skills\obsidian-markdown'
    'obsidian-bases' = 'obsidian-skills\skills\obsidian-bases'
    'json-canvas' = 'obsidian-skills\skills\json-canvas'
    'obsidian-cli' = 'obsidian-skills\skills\obsidian-cli'
    'defuddle' = 'obsidian-skills\skills\defuddle'
    'knap' = 'obsidian-skills\skills\knap'
    'make-note' = 'make-note-skills\skills\make-note'
}

# Translation is consolidated into the local academic-paper-ja-translator.
# Remove only known junctions from previous installations, preserving their targets.
$retiredSources = [ordered]@{
    'academic-paper-translation' = 'scholarly-agent-skills\skills\ja\academic-paper-translation'
    'pdf-translate' = 'paper-translate-agent-skill\pdf-translate'
    'zotero-translate' = 'zotero-translate-skill\skills\zotero-translate'
}
foreach ($relativeRoot in @('skills', '.agents\skills', '.claude\skills')) {
    foreach ($entry in $retiredSources.GetEnumerator()) {
        $linkPath = [IO.Path]::GetFullPath((Join-Path (Join-Path $projectRoot $relativeRoot) $entry.Key))
        $rootPrefix = [IO.Path]::GetFullPath($projectRoot).TrimEnd('\') + '\'
        if (-not $linkPath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
            throw "Refusing to remove a path outside the project: $linkPath"
        }
        $existing = Get-Item -LiteralPath $linkPath -Force -ErrorAction SilentlyContinue
        if ($null -eq $existing) { continue }
        $expected = [IO.Path]::GetFullPath((Join-Path $projectRoot $entry.Value))
        if ($existing.LinkType -ne 'Junction' -or
            [IO.Path]::GetFullPath([string]@($existing.Target)[0]) -ne $expected) {
            throw "Retired skill path was preserved; inspect it manually: $linkPath"
        }
        Remove-Item -LiteralPath $linkPath -Force
        Write-Output "Removed retired skill junction: $linkPath"
    }
}

# Register the Japanese originals only; English variants have the same names.
$scholarlyRoot = Join-Path $projectRoot 'scholarly-agent-skills\skills\ja'
if (-not (Test-Path -LiteralPath $scholarlyRoot -PathType Container)) {
    throw 'Missing scholarly skills; run git submodule update --init --recursive first.'
}
foreach ($skill in Get-ChildItem -LiteralPath $scholarlyRoot -Directory | Sort-Object Name) {
    if ($retiredSources.Contains($skill.Name)) { continue }
    if (Test-Path -LiteralPath (Join-Path $skill.FullName 'SKILL.md') -PathType Leaf) {
        if ($sources.Contains($skill.Name)) {
            throw "Duplicate upstream skill name: $($skill.Name)"
        }
        $sources.Add($skill.Name, "scholarly-agent-skills\skills\ja\$($skill.Name)")
    }
}

function Get-SkillTreeManifest {
    param([string]$RootPath)

    $root = (Resolve-Path -LiteralPath $RootPath).Path.TrimEnd('\')
    foreach ($item in Get-ChildItem -LiteralPath $root -Force -Recurse | Sort-Object FullName) {
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
            throw "Nested links were preserved; inspect this directory manually: $root"
        }
        $relative = $item.FullName.Substring($root.Length + 1)
        if ($item.PSIsContainer) {
            "D|$relative"
        } else {
            $hash = (Get-FileHash -LiteralPath $item.FullName -Algorithm SHA256).Hash
            "F|$relative|$($item.Length)|$hash"
        }
    }
}

function Add-SkillJunction {
    param([string]$LinkPath, [string]$TargetPath)

    $target = (Resolve-Path -LiteralPath $TargetPath).Path
    $existing = Get-Item -LiteralPath $LinkPath -Force -ErrorAction SilentlyContinue
    if ($null -ne $existing) {
        if ($existing.LinkType -eq 'Junction' -and
            [IO.Path]::GetFullPath([string]@($existing.Target)[0]) -eq $target) {
            return
        }
        # Migrate only an ordinary directory with exactly the same contents.
        # Different contents and existing links are never replaced automatically.
        if (-not $existing.PSIsContainer -or
            ($existing.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
            throw "Existing path was preserved; resolve this conflict manually: $LinkPath"
        }
        $originalManifest = @(Get-SkillTreeManifest -RootPath $existing.FullName)
        $targetManifest = @(Get-SkillTreeManifest -RootPath $target)
        if (Compare-Object -ReferenceObject $originalManifest -DifferenceObject $targetManifest) {
            throw "Different contents were preserved; resolve this conflict manually: $LinkPath"
        }

        $rootPrefix = [IO.Path]::GetFullPath($projectRoot).TrimEnd('\') + '\'
        $fullLink = [IO.Path]::GetFullPath($LinkPath)
        if (-not $fullLink.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
            throw "Refusing to move a path outside the project: $fullLink"
        }
        $relative = $fullLink.Substring($rootPrefix.Length)
        $backupId = (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N')
        $backupPath = [IO.Path]::GetFullPath((Join-Path (Join-Path $projectRoot ".skill-backups\$backupId") $relative))
        if (-not $backupPath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
            throw "Refusing to create a backup outside the project: $backupPath"
        }
        New-Item -ItemType Directory -Path (Split-Path -Parent $backupPath) -Force | Out-Null
        Move-Item -LiteralPath $fullLink -Destination $backupPath
        try {
            $backupManifest = @(Get-SkillTreeManifest -RootPath $backupPath)
            if (Compare-Object -ReferenceObject $originalManifest -DifferenceObject $backupManifest) {
                throw "Backup verification failed: $backupPath"
            }
            New-Item -ItemType Junction -Path $fullLink -Target $target | Out-Null
        } catch {
            if (-not (Test-Path -LiteralPath $fullLink)) {
                Move-Item -LiteralPath $backupPath -Destination $fullLink
            }
            throw
        }
        Write-Output "Preserved identical directory in backup: $backupPath"
        return
    }
    New-Item -ItemType Junction -Path $LinkPath -Target $target | Out-Null
}

New-Item -ItemType Directory -Path $sharedRoot -Force | Out-Null
foreach ($entry in $sources.GetEnumerator()) {
    $source = Join-Path $projectRoot $entry.Value
    if (-not (Test-Path -LiteralPath (Join-Path $source 'SKILL.md') -PathType Leaf)) {
        throw "Missing source SKILL.md: $source"
    }
    Add-SkillJunction -LinkPath (Join-Path $sharedRoot $entry.Key) -TargetPath $source
}

$discoveryRoots = @('.agents\skills', '.claude\skills')
foreach ($relativeRoot in $discoveryRoots) {
    $discoveryRoot = Join-Path $projectRoot $relativeRoot
    New-Item -ItemType Directory -Path $discoveryRoot -Force | Out-Null
    foreach ($skill in Get-ChildItem -LiteralPath $sharedRoot -Directory) {
        if (-not (Test-Path -LiteralPath (Join-Path $skill.FullName 'SKILL.md') -PathType Leaf)) {
            continue
        }
        # ジャンクションを作成する際に、リンク先のパスを取得するために、Junctionの場合はTargetプロパティを使用して正しいターゲットパスを取得します。
        $target = $skill.FullName
        if ($skill.LinkType -eq 'Junction') {
            $target = [string]@($skill.Target)[0]
        }
        Add-SkillJunction -LinkPath (Join-Path $discoveryRoot $skill.Name) -TargetPath $target
        Write-Output "$relativeRoot\$($skill.Name) -> $target"
    }
}
