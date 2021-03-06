<template>
  <div class="StudentSignup">
    <h2 class="pb-4">{{ title }}</h2>

    <b-card
      header="Student Signup"
      header-tag="h5"
      border-variant="success"
      header-border-variant="success"
      align="left"
    >
      <b-container fluid>
        <b-form @submit.prevent="signup">
          <b-row class="my-3">
            <b-col sm="3">
              <label for="student-card">Student Card :</label>
            </b-col>
            <b-col sm="12">
              <b-form-file
                id="student-card"
                v-model="studentCardFile"
                :state="studentCardSrcState"
                accept="image/*"
                placeholder="Choose a Student card file or drop it here..."
                drop-placeholder="Drop Student card file here..."
                @change="showImgPreview"
                required
              ></b-form-file>
            </b-col>
          </b-row>

          <b-row class="my-4" align-v="center">
            <b-col sm="5">
              <b-img
                v-if="studentCardSrcState"
                :src="studentCardSrc"
                width="300"
                thumbnail
                fulid
              ></b-img>
            </b-col>
            <b-col sm="7">
              <b-table-simple v-if="checkCardData">
                <b-tr>
                  <b-th>role</b-th>
                  <b-td>{{ registerData.role }}</b-td>
                </b-tr>
                <b-tr>
                  <b-th>id</b-th>
                  <b-td>{{ registerData.id }}</b-td>
                </b-tr>
                <b-tr>
                  <b-th>name</b-th>
                  <b-td>{{ registerData.name }}</b-td>
                </b-tr>
                <b-tr>
                  <b-th>department</b-th>
                  <b-td>{{ registerData.department }}</b-td>
                </b-tr>
              </b-table-simple>
            </b-col>
          </b-row>

          <b-row class="my-3" align-v="center">
            <b-col sm="3">
              <label for="user-password">Password :</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                type="password"
                id="user-password"
                v-model="registerData.password"
                :state="passwordState"
                aria-describedby="input-live-feedback"
                placeholder="Enter your Password"
                trim
                required
              ></b-form-input>
              <b-form-invalid-feedback id="password-live-feedback"
                >Enter at least 8 letters</b-form-invalid-feedback
              >
            </b-col>
          </b-row>

          <b-row class="my-3" align-v="center">
            <b-col sm="3">
              <label for="user-password-confirm">Confirm :</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                type="password"
                id="user-password-confirm"
                v-model="registerData.passwordConfirm"
                :state="passwordConfirmState"
                placeholder="Enter your Password again"
                trim
                required
              ></b-form-input>
              <b-form-invalid-feedback id="password-confirm-live-feedback"
                >Enter at least 8 letters</b-form-invalid-feedback
              >
            </b-col>
          </b-row>

          <b-row class="my-4" align="center">
            <b-col sm="1" offset-sm="4">
              <b-button type="submit" variant="primary">Signup</b-button>
            </b-col>
            <b-col sm="1" offset-sm="1">
              <b-button type="reset" variant="info">Reset</b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-container>
    </b-card>
  </div>
</template>

<script>
import api from '@/services/api';
import authService from '@/services/authApi';
import eventBus from '@/utils/eventBus';

export default {
  name: 'StudentSignup',
  data() {
    return {
      title: 'Register your JNU identity',
      studentCardFile: null,
      studentCardSrc: '',
      registerData: {
        role: '',
        id: '',
        name: '',
        department: '',
        password: '',
        passwordConfirm: '',
      },
    };
  },
  computed: {
    studentCardSrcState() {
      return this.studentCardSrc.length === 0 ? null : true;
    },
    passwordState() {
      return this.registerData.password.length === 0
        ? null
        : !(this.registerData.password.length < 8);
    },
    passwordConfirmState() {
      return this.registerData.passwordConfirm.length === 0
        ? null
        : !(this.registerData.passwordConfirm.length < 8);
    },
    checkCardData() {
      return Boolean(
        this.registerData.role &&
          this.registerData.id &&
          this.registerData.name &&
          this.registerData.department,
      );
    },
  },
  methods: {
    async showImgPreview(event) {
      const imgFile = event.target.files[0];
      const reader = new FileReader();

      reader.onload = async e => {
        try {
          eventBus.$emit('runSpinner');

          this.studentCardSrc = e.target.result;
          const cardRes = await authService.recognizeCard(this.studentCardSrc);
          const cardData = api.getResultData(cardRes);

          this.registerData.role = cardData.role;
          this.registerData.id = cardData.id;
          this.registerData.name = cardData.name;
          this.registerData.department = cardData.department;
        } catch (err) {
          console.log(api.getErrorMsg(err));
          alert('Recongnize card data fail');
        } finally {
          eventBus.$emit('hideSpinner');
        }
      };
      reader.readAsDataURL(imgFile);
    },

    async signup() {
      try {
        eventBus.$emit('runSpinner');

        if (this.registerData.password !== this.registerData.passwordConfirm) {
          alert('Password confirm mismatch');
          return;
        }

        api.setData('role', this.registerData.role);
        await authService.signup(
          this.registerData.id,
          this.registerData.password,
          this.registerData.name,
          this.registerData.department,
        );

        this.$router.push('/Signin');
      } catch (err) {
        console.log(api.getErrorMsg(err));
        alert('Fail to student signup');
      } finally {
        eventBus.$emit('hideSpinner');
      }
    },
  },
};
</script>
