<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubBatches extends Model
{
    use HasFactory;

    protected $fillable = [
        "batch_id",
        "sub_batch"
    ];


    public function batch()
    {
        return $this->belongsTo(Batches::class);
    }

}
