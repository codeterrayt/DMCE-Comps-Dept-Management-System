<?php

namespace App\Http\Controllers;

use App\Models\Batches;
use App\Models\SubBatches;
use Illuminate\Http\Request;

class SubBatchController extends Controller
{
   /**
     * Fetch all batches.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $subBatches = SubBatches::all();
        return response()->json($subBatches);
    }

    /**
     * Store a newly created batch in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'sub_batch' => 'required|string|max:255|unique:sub_batches,sub_batch',
        ]);

        $subBatch = new SubBatches();
        $subBatch->batch_id = $request->batch_id;
        $subBatch->sub_batch = $request->sub_batch;
        $subBatch->save();

        return response()->json($subBatch, 201);
    }

    /**
     * Remove the specified batch from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $subBatch = SubBatches::find($id);

        if (!$subBatch) {
            return response()->json(['message' => 'SubBatch not found'], 404);
        }

        $subBatch->delete();

        return response()->json(['message' => 'SubBatch deleted successfully']);
    }

    /**
     * Update the specified batch in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'sub_batch' => 'required|string|max:255|unique:sub_batches,sub_batch,' . $id,
        ]);

        $subBatch = SubBatches::find($id);

        if (!$subBatch) {
            return response()->json(['message' => 'SubBatch not found'], 404);
        }

        $subBatch->batch_id = $request->batch_id;
        $subBatch->sub_batch = $request->sub_batch;
        $subBatch->save();

        return response()->json($subBatch);
    }
}
