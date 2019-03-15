# Librarian
> 蔵書管理システム(Library Management System)

## これはなに？
- [音色ねいろ(@nirot1r)](https://github.com/nirot1r)が個人的に使用している蔵書管理システム
- Nuxt.js + Express で動作
- データベースはMySQLを使用
- IDパスワードペア認証を採用しており、複数ユーザで共用することが可能
  - 書籍情報は共有されない

## 使用方法
### オンプレミス
#### 前準備
```bash
git clone https://github.com/neirowork/Librarian.git

npm i
```

> ビルドする前に設定ファイルを用意する(あとで書く)

#### ビルド
```bash
npm run build
npm start
```

## コントリビュータ

- [神isGOD(TinyKitten)](https://github.com/TinyKitten)

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
