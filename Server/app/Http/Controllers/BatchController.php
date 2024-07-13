<?php

namespace App\Http\Controllers;

use App\Models\Batches;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $batches = Batches::all();
        return response()->json($batches);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'batch' => 'required|string|max:255|unique:batches,batch',
        ]);

        $batch = new Batches();
        $batch->batch = $request->batch;
        $batch->save();

        return response()->json($batch, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'batch' => 'required|string|max:255|unique:batches,batch,' . $id,
        ]);

        $batch = Batches::find($id);

        if (!$batch) {
            return response()->json(['message' => 'Batch not found'], 404);
        }

        $batch->batch = $request->batch;
        $batch->save();

        return response()->json($batch);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $batch = Batches::find($id);

        if (!$batch) {
            return response()->json(['message' => 'Batch not found'], 404);
        }

        $batch->delete();

        return response()->json(['message' => 'Batch deleted successfully']);
    }
}
