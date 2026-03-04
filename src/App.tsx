import { DataProvider } from '@/store/data-context'
import { useHashRoute } from '@/hooks/use-hash-route'
import { Shell } from '@/components/layout/shell'
import { CapabilityMindmap } from '@/components/tree-map/capability-mindmap'
import { AppDashboard } from '@/components/dashboard/app-dashboard'
import { CapabilityDashboard } from '@/components/dashboard/capability-dashboard'

function AppContent() {
  const [hash, navigate] = useHashRoute()

  return (
    <Shell currentHash={hash} onNavigate={navigate}>
      {hash === '#/tree-map' && <CapabilityMindmap />}
      {hash === '#/applications' && <AppDashboard />}
      {hash === '#/capabilities' && <CapabilityDashboard />}
      {!['#/tree-map', '#/applications', '#/capabilities'].includes(hash) && (
        <CapabilityMindmap />
      )}
    </Shell>
  )
}

export function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}
