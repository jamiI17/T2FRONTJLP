
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Alumno } from '../../models/alumno';
import { AlumnoService } from '../../services/alumno';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  templateUrl: './alumno-list.html',
  styleUrl: './alumno-list.scss'
})
export class AlumnoList implements OnInit {
  private readonly alumnoService = inject(AlumnoService);
  private readonly cdr = inject(ChangeDetectorRef);

  alumnos: Alumno[] = [];
  cargando = false;
  eliminandoId: number | null = null;
  error = '';
  mensaje = '';

  ngOnInit(): void {
    this.listarAlumnos();
  }

  listarAlumnos(): void {
    this.cargando = true;
    this.error = '';

    this.alumnoService.listar().subscribe({
      next: (datos) => {
        this.alumnos = datos;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al listar alumnos:', err);
        this.error =
          'No se pudieron cargar los alumnos. Verifica que el backend esté activo y que la URL sea correcta.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  eliminarAlumno(alumno: Alumno): void {
    const confirmar = confirm(
      `¿Estás seguro de que deseas eliminar al alumno ${alumno.nombres}?`
    );

    if (!confirmar) {
      return;
    }

    this.error = '';
    this.mensaje = '';
    this.eliminandoId = alumno.id;

    this.alumnoService.eliminar(alumno.id).subscribe({
      next: () => {
        this.alumnos = this.alumnos.filter(
          (item) => item.id !== alumno.id
        );
        this.mensaje = 'Alumno eliminado correctamente.';
        this.eliminandoId = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al eliminar alumno:', err);
        this.error =
          'No se pudo eliminar al alumno. Inténtalo nuevamente.';
        this.eliminandoId = null;
        this.cdr.markForCheck();
      }
    });
  }
}
