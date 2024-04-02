<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $rules = [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . auth()->id(),
            'password' => 'nullable|string|min:8',
            'roll_no' => 'nullable|string|max:255',
            'student_id' => 'nullable|string|max:255|unique:users,student_id,' . auth()->id(),
            'admitted_year' => 'nullable|numeric|min:1900|max:' . date('Y'),
            'div' => 'nullable|string|max:2',
            // 'role' => [
            //     'required',
            //     Rule::in(['admin', 'student']), // assuming role can only be one of these values
            // ],
        ];

        $request->validate($rules);




    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
