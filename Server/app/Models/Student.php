<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'roll_no',
        'name',
        'batch',
        'academic_year',
        'course_year',
        'sem'
    ];


    public function user()
    {
        return $this->hasOne(User::class, 'student_id', 'student_id');
    }

    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class, 'student_id', 'student_id');
    }



}
