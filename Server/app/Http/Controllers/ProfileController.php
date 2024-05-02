<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;

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
    public function update(Request $request)
    {

        $rules = [];

        if (Auth::user()->role  == 'admin') {

            $rules = [
                'name' => 'required|string|max:255',
                'middle_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
                // 'password' => 'nullable|string|min:8',
                // 'roll_no' => 'required|string|max:255',
                // 'student_id' => 'required|string|max:255|unique:users,student_id,' . auth()->id(),
                // 'admitted_year' => 'required|numeric|min:1900|max:' . date('Y'),
                // 'div' => 'required|string|max:2',
                // 'role' => [
                //     'required',
                //     Rule::in(['admin', 'student']), // assuming role can only be one of these values
                // ],
            ];
        } else {
            $rules = [
                'name' => 'required|string|max:255',
                'middle_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
                // 'password' => 'nullable|string|min:8',
                'roll_no' => 'required|string|max:255',
                'student_id' => 'required|string|max:255|unique:users,student_id,' . auth()->id(),
                'admitted_year' => 'required|numeric|min:1900|max:' . date('Y'),
                'div' => 'required|string|max:2',
                // 'role' => [
                //     'required',
                //     Rule::in(['admin', 'student']), // assuming role can only be one of these values
                // ],
            ];
        }





        // Get only the fields specified in the rules
        $data = $request->only(array_keys($rules));

        // Remove the "role" field if it exists in the request data
        if (array_key_exists('role', $data)) {
            unset($data['role']);
        }


        // Validate the data
        $validator = Validator::make($data, $rules);

        // Check if validation fails
        if ($validator->fails()) {
            // Handle validation errors
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if validation fails
        if ($validator->fails()) {
            // Handle validation errors
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validation passed, update the user
        $user = User::findOrFail(auth()->id());
        $user->update($data);

        // Return success response
        return response()->json(['message' => 'User updated successfully', 'data' => $user]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function update_password(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'current_password' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!Hash::check($value, Auth::user()->password)) {
                        $fail('The current password is incorrect.');
                    }
                },
            ],
            'new_password' => ['required', 'min:8'],
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

         // Retrieve the currently authenticated user
        $user = Auth::user();

        // Update the user's password
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Return a response indicating success
        return response()->json(['message' => 'Password updated successfully']);
    }
}
