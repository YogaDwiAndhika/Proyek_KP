<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailTransaksiSparepart extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_detail_sparepart';

    protected $fillable = [
        'id_transaksi',
        'id_sparepart',
        'quantity',
        'record_harga_satuan'
    ];

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi', 'id_transaksi');
    }

    public function sparepart()
    {
        return $this->belongsTo(Sparepart::class, 'id_sparepart', 'id_sparepart');
    }
}
