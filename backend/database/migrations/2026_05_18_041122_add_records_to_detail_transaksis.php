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
            $table->decimal('record_harga_satuan', 15, 2)->default(0);
        });

        Schema::table('detail_transaksi_layanans', function (Blueprint $table) {
            $table->decimal('record_biaya', 15, 2)->default(0);
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
            $table->dropColumn('record_harga_satuan');
        });

        Schema::table('detail_transaksi_layanans', function (Blueprint $table) {
            $table->dropColumn('record_biaya');
        });
    }
};
