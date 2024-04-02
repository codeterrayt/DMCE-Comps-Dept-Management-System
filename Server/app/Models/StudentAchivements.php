<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAchivements extends Model
{
    use HasFactory;

    protected $table = "student_achievements";

    protected $fillable = [
        'academic_year',
        'student_year',
        'achievement_certificate_path',
        'achievement_domain',
        'college_name',
        'achievement_level',
        'achievement_location',
        'achievement_date',
        'prize',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }



}
