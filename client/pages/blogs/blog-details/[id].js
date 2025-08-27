import React from 'react'
import { useRouter } from 'next/router'
import BlogDetail from '../blog_detail';

function BlogId() {
    const router = useRouter();
    const {id } = router.query;
  return (
   
<BlogDetail id={id}/>
   
  )
}

export default BlogId