module.exports = {
  //
  apps: [{
    name: "cidpplus-back",
    script: 'app.js',
    watch: './**/*.js',
    cmd: './',
    log_file: true,
    ignore_watch: [
      // 不用监听的文件
      "node_modules",
      "logs",
      "cookies",
      "./**/*.json",
      "./**/*.log",
      "./**/*.txt"
    ],
    out_file: './log/out.log',
    error_file: "./log/app_error.log",
    env: {
      NODE_ENV: 'development' //启动默认模式
    },
    env_production: {
      NODE_ENV: 'production' //启动默认模式
    }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '123.206.73.100',
      ref: 'origin/main',
      repo: 'git@github.com:ayedaren8/cidpplusBack.git',
      path: '/app/cidpplus',
      'post-deploy': 'yarn install && pm2 reload ecosystem.config.js --env production',
    }
  }
};