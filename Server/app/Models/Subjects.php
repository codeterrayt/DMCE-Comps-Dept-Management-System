<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subjects extends Model
{
    use HasFactory;

    protected $fillable = [
        "subject_name",
        "subject_short",
        "subject_sem"
    ];

    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class, 'sem', 'sem');
    }

}
