<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Sparepart;

class SparepartController extends Controller
{
    public function index()
    {
        return response()->json(Sparepart::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_sparepart' => 'required',
            'merk' => 'required',
            'harga_satuan' => 'required|numeric|min:0',
        ]);

        $sparepart = Sparepart::create($request->all());
        return response()->json($sparepart, 201);
    }

    public function show($id)
    {
        $sparepart = Sparepart::findOrFail($id);
        return response()->json($sparepart);
    }

    public function update(Request $request, $id)
    {
        $sparepart = Sparepart::findOrFail($id);
        
        $request->validate([
            'nama_sparepart' => 'required',
            'merk' => 'required',
            'harga_satuan' => 'required|numeric|min:0',
        ]);

        $sparepart->update($request->all());
        return response()->json($sparepart);
    }

    public function destroy($id)
    {
        $sparepart = Sparepart::findOrFail($id);
        $sparepart->delete();
        return response()->json(null, 204);
    }
}
