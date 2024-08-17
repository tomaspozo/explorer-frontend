import { AppLayout } from '@app/components/ui/layouts'
import { Error404Page } from '@app/pages'
import { AddressPage, OverviewPage, TickPage, TxPage } from '@app/pages/network'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Routes from './routes'

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error404Page />,
    children: [
      {
        index: true,
        element: <Navigate to={Routes.NETWORK.ROOT} />
      },
      {
        path: Routes.NETWORK.ROOT,
        children: [
          {
            index: true,
            element: <OverviewPage />
          },
          {
            path: 'tick',
            children: [
              {
                path: ':tick',
                element: <TickPage />
              }
            ]
          },
          {
            path: 'tx',
            children: [
              {
                path: ':txId',
                element: <TxPage />
              }
            ]
          },
          {
            path: 'address',
            children: [
              {
                path: ':addressId',
                element: <AddressPage />
              }
            ]
          }
        ]
      }
    ]
  }
])

export default router
