<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
// use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        // $request->session()->regenerate();

        $token = $request->user()
        ->createToken($request->email,['token-'.$request->user()->role])
        ->plainTextToken;

        return response()->json(["user" => $request->user(), "token" => $token]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->user()->currentAccessToken()->delete();

        // $request->session()->invalidate();

        // $request->session()->regenerateToken();

        // Get user who requested the logout
        // auth()->user()->tokens()->delete();
        return response()->json(['status' => "success"]);
    }
}
