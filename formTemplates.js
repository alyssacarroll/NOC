const formTemplates = {
  // Data Center Walkthrough Check
  '01': `
  <input type="hidden" name="checkNumber" value="01" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Walkthrough Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Tech Support Email Check
  '02': `
  <input type="hidden" name="checkNumber" value="02" />
  <div class="form-popup">
    <label><input type="checkbox" name="Completed" value="TRUE"> Email Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // VPN TAK & WAVE Check
  '03': `
  <input type="hidden" name="checkNumber" value="03" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE">Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // WUG Check
  '04': `
  <input type="hidden" name="checkNumber" value="04" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE">Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // TAK Server Federation Check
  '05': `
  <input type="hidden" name="checkNumber" value="05" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE">Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // PTL Check
  '06': `
  <input type="hidden" name="checkNumber" value="06" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE">Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Message Check
  '07': `
  <input type="hidden" name="checkNumber" value="07" />
  <div class="form-content">

    <label style="padding-top: 10px;">Data:
      <div align="center" style="display: flex; gap: 20px; justify-content: center; padding-top: 10px;">
        <textarea name="Total Device Count" rows="1" placeholder="Total Device Count"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Raw Messages" rows="1" placeholder="Raw Messages"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Unique IMEIs" rows="1" placeholder="Unique IMEIs"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Free Disk Space" rows="1" placeholder="Free Disk Space"
          style="width:21%; font-size:0.80rem;"></textarea>
      </div>
    </label>
  </div>
  `,
  // Landing Pad Server Check
  '08': `
  <input type="hidden" name="checkNumber" value="08" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Landing Pad Server Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // DS File Check
  '09': `
  <input type="hidden" name="checkNumber" value="09" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> DS File Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // WAVE Server Check
  '10': `
  <input type="hidden" name="checkNumber" value="10" />

<div class="columns is-multiline">

  <!-- Column 1 -->
  <div class="column is-one-quarter">
    <div class="field"><label class="label">Fly-216N</label><label class="switch"><input type="checkbox" name="Fly-216N"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-220</label><label class="switch"><input type="checkbox" name="Fly-220"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-222</label><label class="switch"><input type="checkbox" name="Fly-222"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-224</label><label class="switch"><input type="checkbox" name="Fly-224"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-226</label><label class="switch"><input type="checkbox" name="Fly-226"><span class="slider"></span></label></div>
  </div>

  <!-- Column 2 -->
  <div class="column is-one-quarter">
    <div class="field"><label class="label">Fly-228</label><label class="switch"><input type="checkbox" name="Fly-228"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-230</label><label class="switch"><input type="checkbox" name="Fly-230"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-232</label><label class="switch"><input type="checkbox" name="Fly-232"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-234</label><label class="switch"><input type="checkbox" name="Fly-234"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-236</label><label class="switch"><input type="checkbox" name="Fly-236"><span class="slider"></span></label></div>
  </div>

  <!-- Column 3 -->
  <div class="column is-one-quarter">
    <div class="field"><label class="label">Fly-238</label><label class="switch"><input type="checkbox" name="Fly-238"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-240</label><label class="switch"><input type="checkbox" name="Fly-240"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Fly-242</label><label class="switch"><input type="checkbox" name="Fly-242"><span class="slider"></span></label></div>
    <div class="field"><label class="label">MED to VPI</label><label class="switch"><input type="checkbox" name="MED to VPI"><span class="slider"></span></label></div>
    <div class="field"><label class="label">SA14WAVE511MS</label><label class="switch"><input type="checkbox" name="SA14WAVE511MS"><span class="slider"></span></label></div>
  </div>

  <!-- Column 4 -->
  <div class="column is-one-quarter">
    <div class="field"><label class="label">WAVE-PRXY12019.ptbportal.us</label><label class="switch"><input type="checkbox" name="WAVE-PRXY12019.ptbportal.us"><span class="slider"></span></label></div>
    <div class="field"><label class="label">WAVE-PRXY22019.ptbportal.us</label><label class="switch"><input type="checkbox" name="WAVE-PRXY22019.ptbportal.us"><span class="slider"></span></label></div>
    <div class="field"><label class="label">WAVE-MANMED2019.ptbportal.us</label><label class="switch"><input type="checkbox" name="WAVE-MANMED2019.ptbportal.us"><span class="slider"></span></label></div>
    <div class="field"><label class="label">Eastern Europe Vocality</label><label class="switch"><input type="checkbox" name="Eastern Europe Vocality"><span class="slider"></span></label></div>
  </div>
</div>

<div class="form-buttons">
  <button class="submit">Submit</button>
  <button class="close">Close</button>
</div>


`,
  // Eaton Dashboard Check
  '11': `
  <input type="hidden" name="checkNumber" value="11" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Eaton Dashboard Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // InControl Check
  '12': `
  <input type="hidden" name="checkNumber" value="12" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> InControl Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Veeam Daily Backup Check
  '13': `
  <input type="hidden" name="checkNumber" value="13" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Veeam Daily Backup Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // PTB Server Checks
  '14': `
  <input type="hidden" name="checkNumber" value="14" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> PTB Server Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // IPsec Check
  '15': `
  <input type="hidden" name="checkNumber" value="15" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> IPsec Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
};