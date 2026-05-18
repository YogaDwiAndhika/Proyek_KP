<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\MobilController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\SparepartController;
use App\Http\Controllers\LayananController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('pelanggan', PelangganController::class);
Route::apiResource('mobil', MobilController::class);
Route::apiResource('transaksi', TransaksiController::class);
Route::apiResource('sparepart', SparepartController::class);
Route::apiResource('layanan', LayananController::class);
