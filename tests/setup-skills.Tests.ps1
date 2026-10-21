# Standalone regression checks; no Pester or upstream submodules required.
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$tokens = $null
$parseErrors = $null
$ast = [Management.Automation.Language.Parser]::ParseFile(
    (Join-Path $repositoryRoot 'setup-skills.ps1'), [ref]$tokens, [ref]$parseErrors)
if ($parseErrors.Count) { throw ($parseErrors | Out-String) }
foreach ($name in @('Get-SkillTreeManifest', 'Add-SkillJunction')) {
    $definition = $ast.Find({
        param($node)
        $node -is [Management.Automation.Language.FunctionDefinitionAst] -and $node.Name -eq $name
    }, $true)
    if ($null -eq $definition) { throw "Missing function: $name" }
    . ([scriptblock]::Create($definition.Extent.Text))
}

$projectRoot = Join-Path ([IO.Path]::GetTempPath()) ('skill-junction-test-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $projectRoot | Out-Null
$target = Join-Path $projectRoot 'upstream'
$copy = Join-Path $projectRoot 'skills\example'
foreach ($path in @($target, $copy)) {
    New-Item -ItemType Directory -Path (Join-Path $path 'empty') -Force | Out-Null
    [IO.File]::WriteAllText((Join-Path $path 'SKILL.md'), 'original content')
    [IO.File]::WriteAllText((Join-Path $path '.hidden'), 'hidden content')
}
$original = @(Get-SkillTreeManifest $copy)
Add-SkillJunction $copy $target | Out-Null
if ((Get-Item -LiteralPath $copy -Force).LinkType -ne 'Junction') { throw 'Copy was not migrated.' }
$backups = @(Get-ChildItem -LiteralPath (Join-Path $projectRoot '.skill-backups') -Directory)
if ($backups.Count -ne 1) { throw 'Expected one backup.' }
$preserved = Join-Path $backups[0].FullName 'skills\example'
if (Compare-Object $original @(Get-SkillTreeManifest $preserved)) { throw 'Backup contents changed.' }
Add-SkillJunction $copy $target | Out-Null
if (@(Get-ChildItem -LiteralPath (Join-Path $projectRoot '.skill-backups') -Directory).Count -ne 1) {
    throw 'Repeat setup created another backup.'
}

# Modified content and local-only files must survive rejection.
$different = Join-Path $projectRoot 'skills\different'
New-Item -ItemType Directory -Path $different | Out-Null
[IO.File]::WriteAllText((Join-Path $different 'SKILL.md'), 'local edit')
[IO.File]::WriteAllText((Join-Path $different 'notes.txt'), 'local notes')
$before = @(Get-SkillTreeManifest $different)
$rejected = $false
try { Add-SkillJunction $different $target | Out-Null } catch { $rejected = $true }
if (-not $rejected -or (Compare-Object $before @(Get-SkillTreeManifest $different))) {
    throw 'Local edits were not preserved.'
}

# An existing junction to another directory must not be retargeted.
$other = Join-Path $projectRoot 'other'
New-Item -ItemType Directory -Path $other | Out-Null
$wrongLink = Join-Path $projectRoot 'skills\wrong-link'
New-Item -ItemType Junction -Path $wrongLink -Target $other | Out-Null
$rejected = $false
try { Add-SkillJunction $wrongLink $target | Out-Null } catch { $rejected = $true }
if (-not $rejected -or [string]@((Get-Item -LiteralPath $wrongLink -Force).Target)[0] -ne $other) {
    throw 'Existing junction was changed.'
}

# Even a matching directory outside the project must not be moved.
$outside = Join-Path ([IO.Path]::GetTempPath()) ('skill-outside-' + [Guid]::NewGuid().ToString('N'))
Copy-Item -LiteralPath $target -Destination $outside -Recurse
$rejected = $false
try { Add-SkillJunction $outside $target | Out-Null } catch { $rejected = $true }
if (-not $rejected -or -not (Test-Path -LiteralPath (Join-Path $outside 'SKILL.md'))) {
    throw 'Outside-project directory was not preserved.'
}

Write-Output 'PASS: identical copy backed up, repeat setup unchanged, local edits, other junctions and outside paths preserved.'
Write-Output "Test files retained at: $projectRoot"
