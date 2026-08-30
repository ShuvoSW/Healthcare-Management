import { getMyAppointments } from "@/services/appointment.services"
import { getUserInfo } from "@/services/auth.services"
import type { IAppointment } from "@/types/appointment.types"
import { format } from "date-fns"
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  Clock3,
  FileText,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const getAppointmentDate = (appointment: IAppointment) => {
  const value = appointment.schedule?.startDateTime
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const PatientDashboardPage = async () => {
  const [userInfo, appointmentsResponse] = await Promise.all([
    getUserInfo(),
    getMyAppointments(),
  ])

  const appointments = appointmentsResponse.data ?? []
  const now = new Date()
  const upcomingAppointments = appointments
    .filter((appointment) => {
      const date = getAppointmentDate(appointment)
      return date && date >= now && appointment.status !== "CANCELED"
    })
    .sort((left, right) => {
      return getAppointmentDate(left)!.getTime() - getAppointmentDate(right)!.getTime()
    })
  const nextAppointment = upcomingAppointments[0]
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length
  const unpaidAppointments = appointments.filter(
    (appointment) => appointment.paymentStatus !== "PAID" && appointment.status !== "CANCELED",
  ).length

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-2xl border bg-linear-to-br from-cyan-50 via-white to-blue-50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-cyan-700">Patient dashboard</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Good to see you, {userInfo?.name || "there"}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Keep track of your care, upcoming visits, and health records in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/book-appointments"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <CalendarPlus className="size-4" />
              Book appointment
            </Link>
            <Link
              href="/dashboard/my-appointments"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent"
            >
              View appointments
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total appointments</p>
            <CalendarCheck className="size-5 text-cyan-600" />
          </div>
          <p className="text-3xl font-semibold">{appointments.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">All your visits</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Upcoming visits</p>
            <Clock3 className="size-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold">{upcomingAppointments.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Scheduled care</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Completed visits</p>
            <Activity className="size-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-semibold">{completedAppointments}</p>
          <p className="mt-1 text-xs text-muted-foreground">Your care history</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Payment due</p>
            <FileText className="size-5 text-amber-600" />
          </div>
          <p className="text-3xl font-semibold">{unpaidAppointments}</p>
          <p className="mt-1 text-xs text-muted-foreground">Unpaid appointments</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b p-6">
            <div>
              <h2 className="font-semibold">Next appointment</h2>
              <p className="mt-1 text-sm text-muted-foreground">Your closest scheduled visit</p>
            </div>
            <CalendarCheck className="size-5 text-cyan-600" />
          </div>
          <div className="p-6">
            {nextAppointment ? (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <Stethoscope className="size-6" />
                  </div>
                  <div>
                    <p className="font-medium">{nextAppointment.doctor?.name || "Doctor appointment"}</p>
                    <p className="text-sm text-muted-foreground">
                      {nextAppointment.doctor?.designation || "Medical consultation"}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {format(getAppointmentDate(nextAppointment)!, "EEEE, MMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(getAppointmentDate(nextAppointment)!, "h:mm a")}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/my-appointments"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  View details <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="text-sm text-muted-foreground">
                  You have no upcoming appointments scheduled.
                </p>
                <Link
                  href="/dashboard/book-appointments"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Find a doctor <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b p-6">
            <h2 className="font-semibold">Quick access</h2>
            <p className="mt-1 text-sm text-muted-foreground">Common patient actions</p>
          </div>
          <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/consultation"
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <Stethoscope className="size-4 text-cyan-600" />
                Browse doctors
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
            <Link
              href="/dashboard/my-prescriptions"
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <FileText className="size-4 text-blue-600" />
                My prescriptions
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PatientDashboardPage
