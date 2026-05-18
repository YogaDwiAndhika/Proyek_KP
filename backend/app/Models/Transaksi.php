<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_transaksi';

    protected $fillable = [
        'id_user',
        'no_rangka',
        'tanggal_transaksi',
        'km_kendaraan',
        'total_harga'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function mobil()
    {
        return $this->belongsTo(Mobil::class, 'no_rangka', 'no_rangka');
    }

    public function detailSpareparts()
    {
        return $this->hasMany(DetailTransaksiSparepart::class, 'id_transaksi', 'id_transaksi');
    }

    public function detailLayanans()
    {
        return $this->hasMany(DetailTransaksiLayanan::class, 'id_transaksi', 'id_transaksi');
    }
}
