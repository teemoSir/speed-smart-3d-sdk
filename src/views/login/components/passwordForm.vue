<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large">
		<el-form-item prop="user">
			<el-input v-model="form.user" prefix-icon="el-icon-user" clearable
					  :placeholder="$t('login.userPlaceholder')">
				<template #append>
					<el-select v-model="userType" style="width: 130px;">
						<el-option :label="$t('login.admin')" value="admin"></el-option>
						<!--						<el-option :label="$t('login.user')" value="user"></el-option>-->
					</el-select>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password
					  :placeholder="$t('login.PWPlaceholder')"></el-input>
		</el-form-item>
		<el-form-item style="margin-bottom: 10px;">
			<el-col :span="12">
				<el-checkbox :label="$t('login.rememberMe')" v-model="form.autologin"></el-checkbox>
			</el-col>
			<el-col :span="12" class="login-forgot">
				<!--					<router-link to="/reset_password">{{ $t('login.forgetPassword') }}？</router-link>-->
			</el-col>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">{{
					$t('login.signIn')
				}}
			</el-button>
		</el-form-item>
		<!--		<div class="login-reg">-->
		<!--			{{$t('login.noAccount')}} <router-link to="/user_register">{{$t('login.createAccount')}}</router-link>-->
		<!--		</div>-->
	</el-form>
</template>

<script>
import menuCfg from '@/config/menu';
import userinfo from '@/config/userinfo'

export default {
	data() {
		return {
			userType: 'admin',
			form: {
				user: "zhkt",
				password: "zhkt@2022",
				autologin: false
			},
			rules: {
				user: [
					{required: true, message: this.$t('login.userError'), trigger: 'blur'}
				],
				password: [
					{required: true, message: this.$t('login.PWError'), trigger: 'blur'}
				]
			},
			islogin: false,
		}
	},
	watch: {
		userType(val) {
			if (val == 'admin') {
				this.form.user = 'zhkt'
				this.form.password = 'zhkt@2022'
			} else if (val == 'user') {
				this.form.user = 'user'
				this.form.password = 'user'
			}
		}
	},
	mounted() {

	},
	methods: {
		async login() {

			var validate = await this.$refs.loginForm.validate().catch(() => {
			})
			if (!validate) {
				return false
			}

			this.islogin = true
			var data = {
				username: this.form.user,
				password: this.$TOOL.crypto.MD5(this.form.password)
			}
			//获取token
			//var user = await this.$API.auth.token.post(data)
			console.log(data.password)
			var user = userinfo;
			console.log(user);
			if (data.username == 'zhkt' && data.password.toUpperCase() == "2F2235232AFEB2E4ED4927479CB37C08") {
				this.$TOOL.cookie.set("TOKEN", user.token, {
					expires: this.form.autologin ? 24 * 60 * 60 : 0
				})
				this.$TOOL.data.set("USER_INFO", user.userInfo)
			} else {
				this.islogin = false
				this.$message.warning("用户名或密码错误")
				return false
			}
			//获取菜单
			var menu = menuCfg;
			// if(this.form.user == 'admin'){
			// 	menu = await this.$API.system.menu.myMenus.get()
			// }else{
			// 	menu = await this.$API.demo.menu.get()
			// }
			// if(menu.code == 200){
			// 	if(menu.data.menu.length==0){
			// 		this.islogin = false
			// 		this.$alert("当前用户无任何菜单权限，请联系系统管理员", "无权限访问", {
			// 			type: 'error',
			// 			center: true
			// 		})
			// 		return false
			// 	}
			// 	this.$TOOL.data.set("MENU", menu.data.menu)
			// 	this.$TOOL.data.set("PERMISSIONS", menu.data.permissions)
			// }else{
			// 	this.islogin = false
			// 	this.$message.warning(menu.message)
			// 	return false
			// }
			//
			this.$router.replace({
				path: '/'
			})
			this.$TOOL.data.set("MENU", menu.menu)
			this.$TOOL.data.set("PERMISSIONS", menu.permissions)
			this.$message.success("Login Success 登录成功")
			this.islogin = false
		},
	}
}
</script>

<style>
</style>
