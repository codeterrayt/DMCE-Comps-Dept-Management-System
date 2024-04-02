<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentHackathons extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year',
        'student_year',
        'hackathon_title',
        'hackathon_level',
        'hackathon_location',
        'hackathon_from_date',
        'hackathon_to_date',
        'hackathon_prize',
        'hackathon_position',
        'hackathon_college_name',
        'hackathon_certificate_path',
    ];

}
