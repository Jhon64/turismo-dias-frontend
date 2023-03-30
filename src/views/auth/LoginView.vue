<script>
import { ref } from "vue";
import { LoginService } from "@services/Login.service";
import { StorageHelper } from "@/helpers/LocalStorage/storage.helper";
import { TOASTR } from "@/helpers/Alerts/Toastr";
import "./LoginView.scss";
export default {
  name: "LoginView",

  data() {
    return {
      password: "",
      userLogin: "",
      loading: false,
    };
  },
  methods: {
    fnValidarUsuario() {
      this.loading = true;
      const form = { password: this.password, username: this.userLogin };
      LoginService.auth(form)
        .then((res) => {
          this.loading = false;
          debugger
          StorageHelper.createAuthStorage(res.data.body);
            TOASTR.success("Accediendo ...");
            this.$router.push("/inicio");
          // if (res.status == 200) {
          //   StorageHelper.createAuthStorage(res.data.body);
          //   TOASTR.success("Accediendo ...");
          //   this.$router.push("/inicio");
          // } else {
          //   StorageHelper.limpiarStorage();
          //   TOASTR.error(res.data.message || "Ocurrio un error..!");
          //   // this.$router.push("/login");
          // }
        })
        .catch((err) => {
          // console.log(err),
          this.loading = false;
          StorageHelper.limpiarStorage();
          TOASTR.error(err.data.message || "Ocurrio un error..!");
        });
    },
  },
};
</script>
<template>
  <!-- diseño 04 -->

  <!-- <div class="background-forma1">
    <img
      src="assets/img/cuadrado-sombra.png"
      style="width: inherit; height: inherit"
      alt=""
    />
  </div>
  <div class="background-forma2">
    <img
      src="assets/img/cuadrado-sombra.png"
      style="width: inherit; height: inherit"
      alt=""
    />
  </div>
  <div class="background-forma3">
    <img
      src="assets/img/cuadrado-sombra.png"
      style="width: inherit; height: inherit"
      alt=""
    />
  </div> -->

  <!-- <div class="background">
    <img src="assets/img/edificios.svg" alt="" />
  </div>
  <div class="background-1">
    <img src="assets/img/edificios.svg" alt="" />
  </div> -->

  <div class="background">
    <img src="assets/webp/background2-gauseano.webp" alt="" />
  </div>
  <div class="background-gauseano"></div>

  <div class="div-background">
    <div class="container">
      <div class="card1">
        <img src="assets/img/People-working.png" alt="" />
      </div>
      <div class="card2">
        <div class="div-logo">
          <img src="assets/img/image16.png" alt="" />
        </div>
        <div class="div-label">
          <label for="">Hola, Bienvenido</label>
        </div>

        <div class="div-input">
          <input
            type="text"
            class="input-custom"
            v-model="userLogin"
            placeholder="Usuario o Email"
            @keyup.enter="fnValidarUsuario"
          />
          <input
            type="password"
            class="input-custom"
            v-model="password"
            placeholder="Contraseña"
            @keyup.enter="fnValidarUsuario"
          />
        </div>
        <div class="div-btn">
          <button @click="fnValidarUsuario">INGRESAR</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Diseño 03 -->
  <!-- <img class="wave" src="assets/img/wave.png" />
  <div class="container">
    <div class="img">
      <img src="assets/img/wavse.png" />
    </div>
    <div class="login-content">
      <form action="index.html">
        <img src="img/avatar.svg" />
        <h2 class="title">Welcome</h2>
        <div class="input-div one">
          <div class="i">
            <i class="fas fa-user"></i>
          </div>
          <div class="div">
            <h5>Username</h5>
            <input type="text" class="input" />
          </div>
        </div>
        <div class="input-div pass">
          <div class="i">
            <i class="fas fa-lock"></i>
          </div>
          <div class="div">
            <h5>Password</h5>
            <input type="password" class="input" />
          </div>
        </div>
        <a href="#">Forgot Password?</a>
        <input type="submit" class="btn" value="Login" />
      </form>
    </div>
  </div> -->

  <!-- Diseño 02 -->

  <!-- <div class="div-superior">
    <div class="card-superior">
      <div class="card-1">
        <div class="div-logo">
          <div class="logo">
            <img src="assets/img/image16.png" alt="" />
          </div>
          <label
            for=""
            style="
              font-size: 20px !important;
              margin-top: 15px;
              margin-bottom: 10px;
            "
            >BIENVENIDO</label
          >
        </div>
        <div class="div-form">
          <div class="div-input">
            <img
              class="icon-user"
              src="assets/icons/user-icon.svg"
              alt="user"
            />
            <input
              type="text"
              class="input-custom"
              placeholder="email@yawi.com"
            />
          </div>
          <div class="div-input">
            <img
              class="icon-user"
              src="assets/icons/padlock-icon.svg"
              alt="user"
            />
            <input
              type="password"
              class="input-custom"
              placeholder="********"
            />
          </div>
          <button class="btn-ingresar">INGRESAR</button>
        </div>
      </div>
      <div class="card-2">
        <img
          src="assets/webp/desarrolloo.webp"
          class="img-card-2"
          alt="img-card-2"
        />
      </div>
    </div>
  </div> -->

  <!-- Diseño 01 -->

  <!-- <div class="contenedor-general">
    <div class="block-login"></div>
    <img src="assets/img/logo-yawi.svg" alt="logo-yawi" class="logo-yawi" />
    <div class="card-login">
      <div class="card-body-login">
        <h6 class="login-tittle">Login</h6>

        <div class="content-group-login">
          <div class="input-group-login">
            <input
              type="text"
              v-model="userLogin"
              class="form-control-login"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="input-group-login">
            <input
              type="password"
              v-model="password"
              class="form-control-login"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <q-btn
          :loading="loading"
          @click="fnValidarUsuario"
          style="
            background: rgba(255, 254, 254, 0.14);
            color: white;
            margin-top: 65px;
            width: 80%;
            padding: 0rem;
            border-radius: 200px;
            border: none;
            font-size: 16px;
            box-shadow: none;
          "
        >
          Acceder
          <template v-slot:loading>
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </template>
        </q-btn>
      </div>
    </div>
  </div> -->
</template>
