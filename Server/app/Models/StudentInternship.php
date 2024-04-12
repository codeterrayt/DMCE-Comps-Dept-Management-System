<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentInternship extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'academic_year',
        'duration',
        'domain',
        'start_date',
        'end_date',
        'completion_letter_path',
        'certificate_path',
        'offer_letter_path',
        'permission_letter_path',
        'student_year',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }



}
