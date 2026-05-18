<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Layanan;

class LayananController extends Controller
{
    public function index()
    {
        return response()->json(Layanan::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'jenis_layanan' => 'required',
            'biaya' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $layanan = Layanan::create($request->all());
        return response()->json($layanan, 201);
    }

    public function show($id)
    {
        $layanan = Layanan::findOrFail($id);
        return response()->json($layanan);
    }

    public function update(Request $request, $id)
    {
        $layanan = Layanan::findOrFail($id);
        
        $request->validate([
            'jenis_layanan' => 'required',
            'biaya' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $layanan->update($request->all());
        return response()->json($layanan);
    }

    public function destroy($id)
    {
        $layanan = Layanan::findOrFail($id);
        $layanan->delete();
        return response()->json(null, 204);
    }
}
