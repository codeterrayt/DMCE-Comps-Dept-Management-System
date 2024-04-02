<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPlacements extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year',
        'campus_or_off_campus',
        'company_name',
        'position',
        'country',
        'city',
        'state',
        'pincode',
        'package',
        'domain',
        'offer_letter',
        'passout_year',
    ];

}
