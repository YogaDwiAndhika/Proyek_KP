<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'username' => 'Viewer',
            'email' => 'viewer@bengkel.com',
            'password' => Hash::make('password'),
            'role' => 'viewer',
        ]);

        User::create([
            'username' => 'Kasir',
            'email' => 'kasir@bengkel.com',
            'password' => Hash::make('password'),
            'role' => 'kasir',
        ]);

        User::create([
            'username' => 'Owner',
            'email' => 'owner@bengkel.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);
    }
}
