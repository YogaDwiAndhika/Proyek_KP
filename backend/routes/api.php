<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\MobilController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\SparepartController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Owner only routes
    Route::middleware('role:owner')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    // All authenticated users can GET (viewer, kasir, owner)
    Route::get('pelanggan', [PelangganController::class, 'index']);
    Route::get('pelanggan/{pelanggan}', [PelangganController::class, 'show']);
    
    Route::get('mobil', [MobilController::class, 'index']);
    Route::get('mobil/{mobil}', [MobilController::class, 'show']);
    
    Route::get('transaksi', [TransaksiController::class, 'index']);
    Route::get('transaksi/{transaksi}', [TransaksiController::class, 'show']);
    
    Route::get('sparepart', [SparepartController::class, 'index']);
    Route::get('sparepart/{sparepart}', [SparepartController::class, 'show']);
    
    Route::get('layanan', [LayananController::class, 'index']);
    Route::get('layanan/{layanan}', [LayananController::class, 'show']);

    // Only Kasir and Owner can modify data (POST, PUT, DELETE)
    Route::middleware('role:kasir,owner')->group(function () {
        Route::post('pelanggan', [PelangganController::class, 'store']);
        Route::put('pelanggan/{pelanggan}', [PelangganController::class, 'update']);
        Route::delete('pelanggan/{pelanggan}', [PelangganController::class, 'destroy']);
        
        Route::post('mobil', [MobilController::class, 'store']);
        Route::put('mobil/{mobil}', [MobilController::class, 'update']);
        Route::delete('mobil/{mobil}', [MobilController::class, 'destroy']);
        
        Route::post('transaksi', [TransaksiController::class, 'store']);
        Route::put('transaksi/{transaksi}', [TransaksiController::class, 'update']);
        Route::delete('transaksi/{transaksi}', [TransaksiController::class, 'destroy']);
        
        Route::post('sparepart', [SparepartController::class, 'store']);
        Route::put('sparepart/{sparepart}', [SparepartController::class, 'update']);
        Route::delete('sparepart/{sparepart}', [SparepartController::class, 'destroy']);
        
        Route::post('layanan', [LayananController::class, 'store']);
        Route::put('layanan/{layanan}', [LayananController::class, 'update']);
        Route::delete('layanan/{layanan}', [LayananController::class, 'destroy']);
    });
});
