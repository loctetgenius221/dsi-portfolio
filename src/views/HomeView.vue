<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import MarqueeBand from '@/components/MarqueeBand.vue'
import MandateSection from '@/components/MandateSection.vue'
import PhotoBand from '@/components/PhotoBand.vue'
import MissionsIndex from '@/components/MissionsIndex.vue'
import DataBand from '@/components/DataBand.vue'
import ApproachSection from '@/components/ApproachSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import OrgChart from '@/components/OrgChart.vue'
import ContactDirectory from '@/components/ContactDirectory.vue'
import ClosingCta from '@/components/ClosingCta.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <main>
    <HeroSection />
    <!-- <MarqueeBand /> -->
    <MandateSection />
    <ApproachSection />
    <PhotoBand />
    <MissionsIndex />
    <DataBand />
    <ProjectsSection />
    <OrgChart />
    <ContactDirectory />
    <ClosingCta />
  </main>
  <SiteFooter />
</template>
