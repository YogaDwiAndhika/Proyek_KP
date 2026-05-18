<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use Illuminate\Http\Request;

class PelangganController extends Controller
{
    public function index()
    {
        return response()->json(Pelanggan::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'nomor_telp' => 'required',
            'alamat' => 'required',
        ]);

        $pelanggan = Pelanggan::create($request->all());
        return response()->json($pelanggan, 201);
    }

    public function show($id)
    {
        $pelanggan = Pelanggan::findOrFail($id);
        return response()->json($pelanggan);
    }

    public function update(Request $request, $id)
    {
        $pelanggan = Pelanggan::findOrFail($id);
        
        $request->validate([
            'nama_pelanggan' => 'required',
            'nomor_telp' => 'required',
            'alamat' => 'required',
        ]);

        $pelanggan->update($request->all());
        return response()->json($pelanggan);
    }

    public function destroy($id)
    {
        $pelanggan = Pelanggan::findOrFail($id);
        $pelanggan->delete();
        return response()->json(null, 204);
    }
}
