<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('detail_transaksi_spareparts', function (Blueprint $table) {
            $table->decimal('harga_jual', 15, 2)->default(0);
        });

        Schema::table('detail_transaksi_layanans', function (Blueprint $table) {
            $table->decimal('biaya_dikenakan', 15, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detail_transaksi_spareparts', function (Blueprint $table) {
            $table->dropColumn('harga_jual');
        });

        Schema::table('detail_transaksi_layanans', function (Blueprint $table) {
            $table->dropColumn('biaya_dikenakan');
        });
    }
};
