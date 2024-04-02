<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentHigherStudies extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_academic_year',
        'student_exam_type',
        'student_score',
        'university_city',
        'university_state',
        'university_country',
        'university_name',
        'student_course',
        'student_admission_letter',
        'student_project_guide',
    ];

}
