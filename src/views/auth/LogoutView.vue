<script lang="ts" setup>
import { StorageHelper } from '@/helpers/LocalStorage/storage.helper';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'

// cuanod el componente se monta
onMounted(() => {
    const router = useRouter()
    StorageHelper.limpiarStorage()
    // window.location.href = '/login'
    router.push('/login')
    
})
</script>
<template></template>