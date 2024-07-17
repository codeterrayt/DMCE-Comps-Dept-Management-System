<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    use HasFactory;


    protected $fillable = [
        'student_id',
        'sem',
        'subject_id',
        'pr_th',
        'academic_year',
        'course_year',
        'm1',
        'm2',
        'm3',
        'm4',
        'total',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subjects::class, 'subject_sem', 'sem');
    }

}
