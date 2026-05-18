<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mobil extends Model
{
    use HasFactory;

    protected $primaryKey = 'no_rangka';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'no_rangka',
        'id_pelanggan',
        'no_polisi',
        'merk_mobil'
    ];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id_pelanggan');
    }
}
