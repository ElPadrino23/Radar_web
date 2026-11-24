
function extraerDatosLog(logText) {
  function buscarPrimero(patrones) {
    for (const patron of patrones) {
      const m = patron.exec(logText);
      if (m) {
        const val = m[1].trim();
        if (val.toLowerCase() !== 'none' && val !== '') return val;
      }
    }
    return 'None';
  }

// ============================== De aqui en adelante, esto pertenece al modulo 2, todo esto sirve para realizar las extracciones del summary de azure 

  // 1. CreatedDateTime / ActivityDateTime
  const createdDateTime = buscarPrimero([
    /vendor\.properties\.created date time\s+([^\r\n]+)/i,
    /vendor\.properties\.activity date time\s+([^\r\n]+)/i,
    /vendor\.properties\.createdDateTime\s+([^\r\n]+)/i,
    /vendor\.properties\.riskLastUpdatedDateTime\s+([^\r\n]+)/i,
    /vendor\.time\s+([^\r\n]+)/i,
    /event time\s+([^\r\n]+)/i,
    /Event timestamp\s+([^\r\n]+)/i
  ]);

  // 2. UserPrincipalName / Email / Target User
  const userPrincipalName = buscarPrimero([
    /vendor\.properties\.target resources\[0\]\.user principal name\s+([^\r\n]+)/i,
    /vendor\.properties\.user principal name\s+([^\r\n]+)/i,
    /vendor\.properties\.userPrincipalName\s+([^\r\n]+)/i,
    /user\.target\.name\s+([^\r\n]+)/i,
    /user\.target\[0\]\.name\s+([^\r\n]+)/i,
    /user\.email\s+([^\r\n]+)/i,
    /user\.name\s+([^\r\n]+)/i,
    /user id\s+([^\r\n]+)/i
  ]);

  // 3. Identity / Display Name
  const identity = buscarPrimero([
    /user\.target\.full name\s+([^\r\n]+)/i,
    /user\.target\.full_name\s+([^\r\n]+)/i,
    /vendor\.properties\.user display name\s+([^\r\n]+)/i,
    /vendor\.properties\.userDisplayName\s+([^\r\n]+)/i,
    /vendor\.identity\s+([^\r\n]+)/i,
    /user\.full_name\s+([^\r\n]+)/i
  ]);

  // 4. AppDisplayName / Activity / Operation Name
  const appDisplayName = buscarPrimero([
    /vendor\.properties\.initiated by\.app\.display name\s+([^\r\n]+)/i,
    /vendor\.properties\.app display name\s+([^\r\n]+)/i,
    /vendor\.properties\.appDisplayName\s+([^\r\n]+)/i,
    /vendor\.properties\.activity display name\s+([^\r\n]+)/i,
    /vendor\.operationName\s+([^\r\n]+)/i,
    /event\.action\s+([^\r\n]+)/i
  ]);

  // 5. IP Address
  const ipAddress = buscarPrimero([
    /vendor\.properties\.ip address\s+([^\r\n]+)/i,
    /vendor\.properties\.ipAddress\s+([^\r\n]+)/i,
    /vendor\.caller ip address\s+([^\r\n]+)/i,
    /source\.ip\s+([^\r\n]+)/i,
    /source\.address\s+([^\r\n]+)/i,
    /ioc\[0\]\.indicator\s+([^\r\n]+)/i
  ]);

  // 6. Country or Region
  const countryOrRegion = buscarPrimero([
    /vendor\.properties\.location\.country or region\s+([^\r\n]+)/i,
    /vendor\.properties\.location\.countryOrRegion\s+([^\r\n]+)/i,
    /source\.geo\.country iso code\s+([^\r\n]+)/i,
    /source\.geo\.country name\s+([^\r\n]+)/i,
    /vendor\.location\s+([^\r\n]+)/i
  ]);

  // 7. City
  const city = buscarPrimero([
    /vendor\.properties\.location\.city\s+([^\r\n]+)/i,
    /source\.geo\.city name\s+([^\r\n]+)/i,
    /source\.geo\.region name\s+([^\r\n]+)/i
  ]);

  // 8. Device IsCompliant / Managed / Device Detail
  const isCompliant = buscarPrimero([
    /vendor\.properties\.device detail\.is compliant\s+([^\r\n]+)/i,
    /vendor\.properties\.deviceDetail\.isCompliant\s+([^\r\n]+)/i,
    /vendor\.properties\.device detail\.is managed\s+([^\r\n]+)/i,
    /host\.os\.name\s+([^\r\n]+)/i
  ]);

  // 9. FailureReason / Status / Error / Risk
  const failureReason = buscarPrimero([
    /vendor\.properties\.result reason\s+([^\r\n]+)/i,
    /vendor\.result description\s+([^\r\n]+)/i,
    /event\.reason\s+([^\r\n]+)/i,
    /vendor\.properties\.status\.failureReason\s+([^\r\n]+)/i,
    /vendor\.properties\.status\.error code\s+([^\r\n]+)/i,
    /vendor\.properties\.riskLevel\s+([^\r\n]+)/i,
    /error\.code\s+([^\r\n]+)/i
  ]);

  // 10. AuthStepResult / Status Outcome / Risk State
  const authStepResult = buscarPrimero([
    /vendor\.properties\.authenticationDetails\[0\]\.authenticationStepResultDetail\s+([^\r\n]+)/i,
    /vendor\.properties\.result\s+([^\r\n]+)/i,
    /vendor\.result signature\s+([^\r\n]+)/i,
    /vendor\.resultSignature\s+([^\r\n]+)/i,
    /#event\.outcome\s+([^\r\n]+)/i,
    /vendor\.properties\.riskState\s+([^\r\n]+)/i
  ]);

  return [
    createdDateTime,
    userPrincipalName,
    identity,
    appDisplayName,
    ipAddress,
    countryOrRegion,
    city,
    isCompliant,
    failureReason,
    authStepResult,
    '' // Espacio para Analyst Notes
  ].join('\t');
}

const MODULOS = [
  {
    id: 'mod2',
    titulo: 'Módulo 2: Azure Tool',
    descripcion: 'input: Pega el log de azure. Output: Datos necesarios para bitacora.  ' +
      'fecha, usuario, identidad, aplicación, IP, país, ciudad, dispositivo, motivo, resultado de ' +
      'autenticación y notas . El resultado se viene separado por celdas, por lo que se puede pegar en excel',
    video: '',
    entrada: 'Coloca aqui el log :)',
    ejecutar: function (texto) {
      if (!texto.trim()) throw new Error('Pega primero el texto del log.');
      const resultado = extraerDatosLog(texto);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(resultado).catch(function () { /* sin permiso: queda el botón Copiar */ });
      }
      return resultado;
    }
  },
  {
    id: 'mod3',
    titulo: 'Módulo 3',
    descripcion: 'Seguimos trabajando en este modulo',
    video: '',
    entrada: 'Sigo terminando la logica de esta parte',
    ejecutar: function (texto) {
      // TODO: aqui va la logica del modulo 3 (port del Python a JavaScript).
      throw new Error('La lógica de este módulo todavía no está conectada.');
    }
  },
  {
    id: 'lookalike',
    titulo: 'Lookalike',
    descripcion: 'BObjetivo: encontrar dominios parecidos al de la marca',
    abrirUrl: 'paginas/lookalike.html',
    boton: 'Launchhhh'
  }
];
