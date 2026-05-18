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
        Schema::create('detail_transaksi_spareparts', function (Blueprint $table) {
            $table->id('id_detail_sparepart');
            $table->unsignedBigInteger('id_transaksi');
            $table->unsignedBigInteger('id_sparepart');
            $table->integer('quantity');
            $table->timestamps();

            $table->foreign('id_transaksi')->references('id_transaksi')->on('transaksis')->onDelete('cascade');
            $table->foreign('id_sparepart')->references('id_sparepart')->on('spareparts')->onDelete('cascade');
        });

        Schema::create('detail_transaksi_layanans', function (Blueprint $table) {
            $table->id('id_detail_layanan');
            $table->unsignedBigInteger('id_transaksi');
            $table->unsignedBigInteger('id_layanan');
            $table->timestamps();

            $table->foreign('id_transaksi')->references('id_transaksi')->on('transaksis')->onDelete('cascade');
            $table->foreign('id_layanan')->references('id_layanan')->on('layanans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detail_transaksi_layanans');
        Schema::dropIfExists('detail_transaksi_spareparts');
    }
};
