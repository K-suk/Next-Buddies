"use client"; // これを最上部に追加します

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // next/router ではなく next/navigation を使用
import Image from "next/image";
import styles from "./page.module.css";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // ページがロードされたら、'/home'にリダイレクト
    router.push("/home");
  }, [router]);

  return null; // コンポーネントをレンダリングしない
}