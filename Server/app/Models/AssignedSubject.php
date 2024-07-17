<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignedSubject extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'subject_id', 'pr_th', 'batch', 'sub_batch',
    // 'sem'
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subject(){
        return $this->belongsTo(Subjects::class,"subject_id","id");
    }

}
