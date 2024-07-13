<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batches extends Model
{
    use HasFactory;

    protected $fillable = [
        "batch"
    ];

    public function subBatches()
    {
        return $this->hasMany(SubBatches::class);
    }

}
