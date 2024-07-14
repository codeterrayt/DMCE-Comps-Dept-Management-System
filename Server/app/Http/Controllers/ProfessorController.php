<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfessorController extends Controller
{

    protected $PROFESSOR_ROLE = "professor";

    /**
     * Fetch all professors.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $professors = Professor::with('user')->get();
        return response()->json($professors);
    }

    /**
     * Store a newly created professor in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'professor_name' => 'required|string|max:255',
            'professor_gender' => 'required|string|in:male,female,other',
            'professor_phone_no' => 'required|string|digits_between:10,12',
            'professor_name_alias' => 'nullable|string|max:255',
            'professor_email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);


        $user = new User();
        $user->name = $request->professor_name;
        $user->email = $request->professor_email;
        $user->role = $this->PROFESSOR_ROLE;
        $user->password = Hash::make($request->password);
        $user->save();

        $professor = new Professor();
        // $professor->professor_name = $request->professor_name;
        $professor->professor_gender = $request->professor_gender;
        $professor->professor_phone_no = $request->professor_phone_no;
        $professor->professor_name_alias = $request->professor_name_alias;
        $professor->user_id = $user->id;
        // $professor->professor_email = $request->professor_email;
        $professor->save();



        return response()->json($professor->load('user'));
    }

    /**
     * Display the specified professor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $professor = Professor::with('user')->find($id);

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        return response()->json($professor);
    }

    /**
     * Update the specified professor in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $professor = Professor::find($id);

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'professor_name' => 'required|string|max:255',
            'professor_gender' => 'required|string|in:male,female,other',
            'professor_phone_no' => 'required|string|digits_between:10,12',
            'professor_name_alias' => 'nullable|string|max:255',
            'professor_email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($professor->user_id),
            ],
            'password' => 'nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        // $request->validate([
        //     'professor_email' => [
        //         'required',
        //         'string',
        //         'email',
        //         'max:255',
        //         Rule::unique('users', 'email')->ignore($request->professor_email, 'email'),
        //     ],
        // ]);



        // $professor->professor_name = $request->professor_name;
        $professor->professor_gender = $request->professor_gender;
        $professor->professor_phone_no = $request->professor_phone_no;
        $professor->professor_name_alias = $request->professor_name_alias;
        // $professor->professor_email = $request->professor_email;
        $professor->save();

        // if ($request->professor_email) {
        $user = User::where('id',$professor->user_id)->first();
        if ($user) {
            $user->name = $request->professor_name;
            $user->email = $request->professor_email;
            if ($request->password) {
                $user->password = Hash::make($request->password);
            }
            $user->save();
        } else {
            // dd("nmot founbd");
            // $user = new User();
            // $user->name = $request->professor_name;
            // $user->email = $request->professor_email;
            // $user->password = Hash::make($request->password);
            // $user->save();
        }
        // }

        return response()->json($professor->load('user'));
    }

    /**
     * Remove the specified professor from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $professor = Professor::find($id);

        if (!$professor) {
            return response()->json(['message' => 'Professor not found'], 404);
        }

        $user = User::where('id', $professor->user_id)->first();
        if ($user) {
            $user->delete();
        }

        $professor->delete();

        return response()->json(['message' => 'Professor deleted successfully']);
    }
}
