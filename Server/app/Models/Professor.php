<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professor extends Model
{
    use HasFactory;

    protected $fillable = [
        // 'professor_name',
        'professor_gender',
        'professor_phone_no',
        'professor_name_alias',
        // 'professor_email',
    ];

    // public function user()
    // {
    //     return $this->hasOne(User::class, 'id', 'user_id');
    // }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
