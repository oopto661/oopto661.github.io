Add-Type -AssemblyName System.Drawing
$orig = [System.Drawing.Bitmap]::FromFile("C:\Users\billb\.gemini\antigravity\scratch\old-orchard-pto\pto-calendar-26-27.original.jpg")
$bmp = New-Object System.Drawing.Bitmap($orig.Width, $orig.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($orig, 0, 0, $orig.Width, $orig.Height)
$orig.Dispose()

$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

function FillRoundedRectangle($graphics, $brush, $x, $y, $w, $h, $radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $graphics.FillPath($brush, $path)
    $path.Dispose()
}

$peachBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(249, 235, 217))
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 20, 20)) # Dark black/charcoal like original
$meetingBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(216, 30, 40)) # Crimson highlight for meetings

$regularFont = New-Object System.Drawing.Font("Arial", 8.0, [System.Drawing.FontStyle]::Bold)
$smallFont = New-Object System.Drawing.Font("Arial", 7.2, [System.Drawing.FontStyle]::Bold)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

$monthData = @(
    @{ Name="August"; X=43; Y=238; W=154; H=115; Lines=@(
        @{ T="12 – Popsicles with PTO"; M=$false },
        @{ T="13 – Coffee with the Principals"; M=$false },
        @{ T="24 – PTO Meeting (8:15 AM)"; M=$true }
    )},
    @{ Name="September"; X=218; Y=238; W=154; H=115; Lines=@(
        @{ T="14 – PowerUp PledgeDrive Kickoff"; M=$false; Sub=$true },
        @{ T="18 – Fall Festival"; M=$false },
        @{ T="28 – PTO Meeting (8:15 AM)"; M=$true }
    )},
    @{ Name="October"; X=393; Y=238; W=154; H=115; Lines=@(
        @{ T="1 – PowerUp Fun Run"; M=$false },
        @{ T="26 – PTO Meeting (8:15 AM)"; M=$true },
        @{ T="30 – Trunk or Treat"; M=$false },
        @{ T="30 – Halloween Parade"; M=$false }
    )},
    @{ Name="November"; X=568; Y=238; W=154; H=115; Lines=@(
        @{ T="12–19 – Book Fair"; M=$false },
        @{ T="30** – PTO Meeting (8:15 AM)"; M=$true }
    )},
    @{ Name="December"; X=43; Y=416; W=154; H=115; Lines=@(
        @{ T="1–4 – Family Gift Basket Collection"; M=$false; Sub=$true },
        @{ T="7–11 – Holiday Gift Shop"; M=$false }
    )},
    @{ Name="January"; X=218; Y=416; W=154; H=115; Lines=@(
        @{ T="25 – PTO Meeting (8:15 AM)"; M=$true },
        @{ T="29 – Chuck E Cheese Night"; M=$false }
    )},
    @{ Name="February"; X=393; Y=416; W=154; H=115; Lines=@(
        @{ T="16 – Bingo For Books"; M=$false },
        @{ T="17 – Pastries with Parents"; M=$false },
        @{ T="18 – Career Day • 19 – Owls Dance"; M=$false; Sub=$true },
        @{ T="22 – PTO Meeting (8:15 AM)"; M=$true }
    )},
    @{ Name="March"; X=568; Y=416; W=154; H=115; Lines=@(
        @{ T="1–5 – Read Across America"; M=$false },
        @{ T="All Month Read-A-Thon"; M=$false },
        @{ T="10 – Picnic with Parents"; M=$false },
        @{ T="22 – PTO Meeting (8:15 AM)"; M=$true }
    )},
    @{ Name="April"; X=124; Y=590; W=156; H=115; Lines=@(
        @{ T="22 – Multicultural Night"; M=$false },
        @{ T="26 – PTO Meeting (8:15 AM)"; M=$true },
        @{ T="26–30 Staff Appreciation"; M=$false }
    )},
    @{ Name="May"; X=302; Y=590; W=156; H=115; Lines=@(
        @{ T="6 – Open House"; M=$false },
        @{ T="17–21 Penny Wars (TBD)"; M=$false },
        @{ T="24 – PTO Meeting (8:15 AM)"; M=$true }
    )},
    @{ Name="June"; X=480; Y=590; W=156; H=115; Lines=@(
        @{ T="Have a Great Summer!"; M=$false },
        @{ T="Thank you, Owls!"; M=$false; Sub=$true }
    )}
)

foreach ($m in $monthData) {
    FillRoundedRectangle $g $peachBrush $m.X $m.Y $m.W $m.H 32
    
    $lineCount = $m.Lines.Count
    $lineSpacing = if ($lineCount -gt 3) { 17 } else { 20 }
    $totalH = ($lineCount - 1) * $lineSpacing
    $startY = $m.Y + ($m.H - $totalH) / 2
    $centerX = $m.X + $m.W / 2

    for ($i = 0; $i -lt $lineCount; $i++) {
        $line = $m.Lines[$i]
        $curY = $startY + ($i * $lineSpacing)
        $useBrush = if ($line.M) { $meetingBrush } else { $textBrush }
        $useFont = if ($line.Sub) { $smallFont } else { $regularFont }
        $g.DrawString($line.T, $useFont, $useBrush, $centerX, $curY, $sf)
    }
}

$bmp.Save("C:\Users\billb\.gemini\antigravity\scratch\old-orchard-pto\pto-calendar-26-27.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()
Write-Output "Successfully updated pto-calendar-26-27.jpg with aligned Row 3"
