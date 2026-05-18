<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\DetailTransaksiSparepart;
use App\Models\DetailTransaksiLayanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    public function index()
    {
        return response()->json(Transaksi::with(['mobil.pelanggan', 'user', 'detailSpareparts.sparepart', 'detailLayanans.layanan'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_user' => 'nullable|exists:users,id_user',
            'no_rangka' => 'required|exists:mobils,no_rangka',
            'tanggal_transaksi' => 'required|date',
            'km_kendaraan' => 'required|numeric|min:0',
            'total_harga' => 'required|numeric',
            'spareparts' => 'array',
            'layanans' => 'array',
        ]);

        DB::beginTransaction();
        try {
            $transaksi = Transaksi::create($request->only(['id_user', 'no_rangka', 'tanggal_transaksi', 'km_kendaraan', 'total_harga']));

            if ($request->has('spareparts')) {
                foreach ($request->spareparts as $sp) {
                    $sparepart = \App\Models\Sparepart::find($sp['id_sparepart']);
                    DetailTransaksiSparepart::create([
                        'id_transaksi' => $transaksi->id_transaksi,
                        'id_sparepart' => $sp['id_sparepart'],
                        'quantity' => $sp['quantity'],
                        'record_harga_satuan' => $sparepart ? $sparepart->harga_satuan : 0,
                    ]);
                }
            }

            if ($request->has('layanans')) {
                foreach ($request->layanans as $lay) {
                    $layanan = \App\Models\Layanan::find($lay['id_layanan']);
                    DetailTransaksiLayanan::create([
                        'id_transaksi' => $transaksi->id_transaksi,
                        'id_layanan' => $lay['id_layanan'],
                        'record_biaya' => $layanan ? $layanan->biaya : 0,
                    ]);
                }
            }
            DB::commit();
            return response()->json($transaksi->load(['detailSpareparts', 'detailLayanans']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $transaksi = Transaksi::with(['mobil.pelanggan', 'user', 'detailSpareparts.sparepart', 'detailLayanans.layanan'])->findOrFail($id);
        return response()->json($transaksi);
    }

    public function update(Request $request, $id)
    {
        $transaksi = Transaksi::findOrFail($id);
        
        $request->validate([
            'id_user' => 'nullable|exists:users,id_user',
            'no_rangka' => 'required|exists:mobils,no_rangka',
            'tanggal_transaksi' => 'required|date',
            'km_kendaraan' => 'required|numeric|min:0',
            'total_harga' => 'required|numeric',
            'spareparts' => 'array',
            'layanans' => 'array',
        ]);

        DB::beginTransaction();
        try {
            $transaksi->update($request->only(['id_user', 'no_rangka', 'tanggal_transaksi', 'km_kendaraan', 'total_harga']));

            if ($request->has('spareparts')) {
                DetailTransaksiSparepart::where('id_transaksi', $id)->delete();
                foreach ($request->spareparts as $sp) {
                    $sparepart = \App\Models\Sparepart::find($sp['id_sparepart']);
                    $record_harga = isset($sp['record_harga_satuan']) ? $sp['record_harga_satuan'] : ($sparepart ? $sparepart->harga_satuan : 0);
                    DetailTransaksiSparepart::create([
                        'id_transaksi' => $transaksi->id_transaksi,
                        'id_sparepart' => $sp['id_sparepart'],
                        'quantity' => $sp['quantity'],
                        'record_harga_satuan' => $record_harga,
                    ]);
                }
            }

            if ($request->has('layanans')) {
                DetailTransaksiLayanan::where('id_transaksi', $id)->delete();
                foreach ($request->layanans as $lay) {
                    $layanan = \App\Models\Layanan::find($lay['id_layanan']);
                    $record_biaya = isset($lay['record_biaya']) ? $lay['record_biaya'] : ($layanan ? $layanan->biaya : 0);
                    DetailTransaksiLayanan::create([
                        'id_transaksi' => $transaksi->id_transaksi,
                        'id_layanan' => $lay['id_layanan'],
                        'record_biaya' => $record_biaya,
                    ]);
                }
            }
            DB::commit();
            return response()->json($transaksi->load(['detailSpareparts', 'detailLayanans']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $transaksi = Transaksi::findOrFail($id);
        $transaksi->delete();
        return response()->json(null, 204);
    }
}
