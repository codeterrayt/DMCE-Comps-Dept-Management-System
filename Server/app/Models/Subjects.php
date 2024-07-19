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

    public function attendances2()
    {
        return $this->hasMany(StudentAttendance::class, 'sem', 'subject_sem');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_subjects', 'subject_id', 'student_id');
    }

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }

}
