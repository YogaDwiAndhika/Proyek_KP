<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sparepart extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_sparepart';

    protected $fillable = [
        'nama_sparepart',
        'merk',
        'harga_satuan'
    ];
}
