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
    'pdf-translate'     = 'paper-translate-agent-skill\pdf-translate'
    'zotero-translate'  = 'zotero-translate-skill\skills\zotero-translate'
    'creating-marp-slides' = 'marp-slides\.claude\skills\creating-marp-slides'
    'marp-slide'        = 'agent-toolkit\skills\marp-slide'
    'interactive-slide' = 'interactive-slide\plugins\interactive-slide\skills\interactive-slide'
}

# Register the Japanese originals only; English variants have the same names.
$scholarlyRoot = Join-Path $projectRoot 'scholarly-agent-skills\skills\ja'
if (-not (Test-Path -LiteralPath $scholarlyRoot -PathType Container)) {
    throw 'Missing scholarly skills; run git submodule update --init --recursive first.'
}
foreach ($skill in Get-ChildItem -LiteralPath $scholarlyRoot -Directory | Sort-Object Name) {
    if (Test-Path -LiteralPath (Join-Path $skill.FullName 'SKILL.md') -PathType Leaf) {
        if ($sources.Contains($skill.Name)) {
            throw "Duplicate upstream skill name: $($skill.Name)"
        }
        $sources.Add($skill.Name, "scholarly-agent-skills\skills\ja\$($skill.Name)")
    }
}

function Add-SkillJunction {
    param([string]$LinkPath, [string]$TargetPath)

    $target = (Resolve-Path -LiteralPath $TargetPath).Path
    $existing = Get-Item -LiteralPath $LinkPath -Force -ErrorAction SilentlyContinue
    if ($null -ne $existing) {
        if ($existing.LinkType -ne 'Junction' -or
            [IO.Path]::GetFullPath([string]@($existing.Target)[0]) -ne $target) {
            throw "Existing path was preserved; resolve this conflict manually: $LinkPath"
        }
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
