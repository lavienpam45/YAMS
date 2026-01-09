<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Aset</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 9px;
            color: #333;
        }
        .header {
            text-align: left;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0;
            color: #222;
        }
        .header p {
            font-size: 11px;
            margin: 5px 0 0 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        thead th {
            background-color: #047857; /* Warna hijau tua */
            color: white;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #ddd;
        }
        tbody td {
            padding: 6px 8px;
            border: 1px solid #ddd;
            vertical-align: top;
        }
        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Laporan Aset YAMS</h1>
        <p>Dicetak pada: {{ now()->format('d/m/Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Ruang</th>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Tgl Terima</th>
                <th>Merk</th>
                <th>Kondisi</th>
                <th>Harga Saat Ini</th>
            </tr>
        </thead>
        <tbody>
            @forelse($assets as $index => $asset)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $asset->room_name }}</td>
                    <td>{{ $asset->asset_code }}</td>
                    <td>{{ $asset->name }}</td>
                    <td>{{ $asset->received_date ? \Carbon\Carbon::parse($asset->received_date)->format('Y-m-d') : '-' }}</td>
                    <td>{{ $asset->brand }}</td>
                    <td>{{ $asset->status }}</td>
                    <td>Rp {{ number_format($asset->book_value, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center;">Tidak ada data aset ditemukan.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
