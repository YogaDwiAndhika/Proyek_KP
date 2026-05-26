<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailTransaksiLayanan extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_detail_layanan';

    protected $fillable = [
        'id_transaksi',
        'id_layanan',
        'biaya_dikenakan'
    ];

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi', 'id_transaksi');
    }

    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'id_layanan', 'id_layanan');
    }
}
