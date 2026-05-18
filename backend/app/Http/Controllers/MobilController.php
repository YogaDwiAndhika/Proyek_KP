<?php

namespace App\Http\Controllers;

use App\Models\Mobil;
use Illuminate\Http\Request;

class MobilController extends Controller
{
    public function index()
    {
        return response()->json(Mobil::with('pelanggan')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'no_rangka' => 'required|unique:mobils,no_rangka',
            'id_pelanggan' => 'required|exists:pelanggans,id_pelanggan',
            'no_polisi' => ['required', 'string', 'max:9', 'regex:/^[A-Za-z]{1,2}[0-9]{1,4}[A-Za-z]{1,3}$/'],
            'merk_mobil' => 'required',
        ]);

        $mobil = Mobil::create($request->all());
        return response()->json($mobil, 201);
    }

    public function show($id)
    {
        $mobil = Mobil::with('pelanggan')->findOrFail($id);
        return response()->json($mobil);
    }

    public function update(Request $request, $id)
    {
        $mobil = Mobil::findOrFail($id);
        
        $request->validate([
            'no_rangka' => 'required|unique:mobils,no_rangka,' . $id . ',no_rangka',
            'id_pelanggan' => 'required|exists:pelanggans,id_pelanggan',
            'no_polisi' => ['required', 'string', 'max:9', 'regex:/^[A-Za-z]{1,2}[0-9]{1,4}[A-Za-z]{1,3}$/'],
            'merk_mobil' => 'required',
        ]);

        $mobil->update($request->all());
        return response()->json($mobil);
    }

    public function destroy($id)
    {
        $mobil = Mobil::findOrFail($id);
        $mobil->delete();
        return response()->json(null, 204);
    }
}
